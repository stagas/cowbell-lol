/** @jsxImportSource minimal-view */

export const Avatar = ({ username, size = 40 }: { username: string, size?: number }) => <img
  crossorigin="anonymous"
  src={`https://avatars.githubusercontent.com/${username}?s=${size}&v=4`}
/>
