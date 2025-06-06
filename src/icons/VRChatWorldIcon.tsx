import { SVGProps } from 'react';
import vrchatIcon from './vrchat_icon.png';

export function VRChatWorldIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <img src={vrchatIcon} alt="VRChat" className={className} {...props} />
  );
}