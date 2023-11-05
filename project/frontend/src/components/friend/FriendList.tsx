import FriendCard from './FriendCard';
function FriendList() {
  return (
    <div className="mt-2xl grid gap-lg justify-center">
      <FriendCard nickname="klew" avatar_src="" />
      <FriendCard nickname="minkim" avatar_src="" />
      <FriendCard nickname="ede-thom" avatar_src="" />
      {/* for loop */}
    </div>
  );
}
export default FriendList;
