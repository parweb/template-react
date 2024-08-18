import { RiMailSendLine } from 'react-icons/ri';

import { Button } from 'components/ui';

const Home = () => {
  return (
    <>
      <div className="flex flex-col gap-2 justify-center items-center scale-150">
        <h1 className="text-3xl">chris lg</h1>

        <Button className="flex gap-2 items-center justify-center">
          <RiMailSendLine />
          <a href="mailto:contact@chrislg.com">contact@chrislg.com</a>
        </Button>
      </div>
    </>
  );
};

export default Home;
