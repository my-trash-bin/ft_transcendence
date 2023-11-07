import toast, { Toaster } from 'react-hot-toast';

function ProfileArticle() {
  const profile = () => toast(`프로필 수정`);
  return (
    <div className="w-[1225px] h-xl bg-light-background border-5 border-dark-purple mt-xl ml-xl">
      <Toaster />
      <div className="mt-lg ml-lg">
        <h2 className="text-h2 font-bold">프로필</h2>
        <p>hiostory information goes here.</p>
        <button onClick={profile}>View profile Details</button>
      </div>
    </div>
  );
}

export default ProfileArticle;
