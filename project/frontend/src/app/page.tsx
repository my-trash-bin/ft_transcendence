import LinkButton from '../components/common/LinkButton';

export default function Page() {
  return (
    <div className="flex flex-col h-[100vh] justify-center items-center">
      <h1>Here is starting page</h1>
      <LinkButton text="go to friend" href="/friend" />
      <LinkButton text="go to login page" href="/sign-in" />
    </div>
  );
}
