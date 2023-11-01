import LinkButton from '../../components/common/button/link-button';

export default function Page() {
  return (
    <>
      <h1>Here is starting page</h1>
      <LinkButton text="go to friend" href="/friend" />
      <LinkButton text="go to login page" href="/login" />
    </>
  );
}
