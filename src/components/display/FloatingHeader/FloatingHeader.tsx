import Logo from '@/components/display/FloatingHeader/Logo/Logo';
import HeaderButtonGroup from '@/components/display/FloatingHeader/HeaderButtonGroup/HeaderButtonGroup';

const FloatingHeader = () => {
  return (
    <div className={'fixed top-0 z-50 w-full pl-5 pr-6 py-3 justify-between flex align-middle items-center '}>
      <Logo />
      <HeaderButtonGroup />
    </div>
  );
};

export default FloatingHeader;
