import React from 'react';
import { IconProps } from './icon';

export default function InvitesIcon({ className }: IconProps) {
  // Placeholder, please make a real icon
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 5.23077C9 7.60984 7.65685 8.46154 6 8.46154C4.34315 8.46154 3 7.60984 3 5.23077C3 2.8517 4.34315 2 6 2C7.65685 2 9 2.8517 9 5.23077ZM6 8.46154C2.68629 8.46154 0 9.92159 0 14H12C12 9.92159 9.31371 8.46154 6 8.46154ZM14 4C14 3.44772 13.5523 3 13 3C12.4477 3 12 3.44772 12 4V5H11C10.4477 5 10 5.44772 10 6C10 6.55228 10.4477 7 11 7H12V8C12 8.55228 12.4477 9 13 9C13.5523 9 14 8.55228 14 8V7H15C15.5523 7 16 6.55228 16 6C16 5.44772 15.5523 5 15 5H14V4Z"
        fill="#666666"
      />
    </svg>
  );
}
