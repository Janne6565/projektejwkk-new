import LanguageSelectorButton from '@/components/display/FloatingHeader/HeaderButtonGroup/LanguageSelectorButton/LanguageSelectorButton.tsx';

const HeaderButtonGroup = () => {
  return (
    <div className="flex gap-4 h-10">
      <LanguageSelectorButton />
    </div>
  );
};

export default HeaderButtonGroup;
