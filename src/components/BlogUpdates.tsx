import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface BlogPost {
  id: string;
  content: string;
  created_at: string;
  likes: number;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export function BlogUpdates() {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [tooltipTimer, setTooltipTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPosts();
    checkLikedPosts();
  }, []);

  useEffect(() => {
    return () => {
      if (tooltipTimer) {
        clearTimeout(tooltipTimer);
      }
    };
  }, [tooltipTimer]);

  const checkLikedPosts = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      if (!response.ok) {
        throw new Error('Failed to fetch IP address');
      }
      
      const ipData = await response.json();
      if (!ipData || !ipData.ip) {
        throw new Error('Invalid IP address data received');
      }

      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('ip_address', ipData.ip);

      if (likes) {
        const likedPostIds = new Set(likes.map(like => like.post_id));
        setLikedPosts(likedPostIds);
      }
    } catch (error) {
      console.error('Error checking liked posts:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (likedPosts.has(postId)) {
      // Show tooltip
      setShowTooltip(postId);
      
      // Clear any existing timer
      if (tooltipTimer) {
        clearTimeout(tooltipTimer);
      }
      
      // Set new timer to hide tooltip after 2 seconds
      const timer = setTimeout(() => {
        setShowTooltip(null);
      }, 2000);
      
      setTooltipTimer(timer);
      return;
    }

    try {
      // Get user's IP address with error handling
      const response = await fetch('https://api.ipify.org?format=json');
      if (!response.ok) {
        throw new Error('Failed to fetch IP address');
      }
      
      const ipData = await response.json();
      if (!ipData || !ipData.ip) {
        throw new Error('Invalid IP address data received');
      }

      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('ip_address', ipData.ip)
        .maybeSingle();

      if (existingLike) {
        console.log('Already liked this post');
        return;
      }

      // Insert new like
      const { error: likeError } = await supabase
        .from('post_likes')
        .insert([
          { post_id: postId, ip_address: ipData.ip }
        ]);

      if (likeError) {
        console.error('Error adding like:', likeError);
        return;
      }

      // Update post likes count
      const { error: updateError } = await supabase.rpc('increment_likes', {
        post_id: postId
      });

      if (updateError) {
        console.error('Error updating likes count:', updateError);
        return;
      }

      // Update local state
      setLikedPosts(prev => new Set([...prev, postId]));
      
      // Refresh posts to show updated likes count
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="grid-card">
      <h2 className="text-2xl font-bold mb-4 text-purple-300">Latest Updates</h2>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="p-4 rounded bg-purple-900/30 neon-border">
            <p className="text-sm text-purple-400 mb-2">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-white">{post.content}</p>
            <div className="flex gap-2 mt-2 relative">
              <button 
                className="text-red-400 hover:text-red-300 transition-colors relative"
                onClick={() => handleLike(post.id)}
              >
                <Heart 
                  className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} 
                />
                {showTooltip === post.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-purple-900/90 rounded shadow-lg whitespace-nowrap">
                    You already liked this post!
                  </div>
                )}
              </button>
              <span className="text-sm text-purple-400">{post.likes} likes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}