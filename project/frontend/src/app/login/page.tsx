import LinkButton from '../../../components/common/button/link-button';

export default function Page() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="p-4 space-y-4 text-center">
        <div className="text-2xl">Login page</div>
        <LinkButton text="Go to Friend" href="/friend" />
      </div>
    </div>
  );
}
