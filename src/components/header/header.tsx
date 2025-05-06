import { HeaderLogo } from '@/components/header/sub-components/header-logo/header-logo';
import { HeaderNavigation } from '@/components/header/sub-components/header-navigation/header-navigation';
import { UserButton, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { WelcomeMsg } from './sub-components/welcome-msg/welcome-msg';

export const Header = () => {
  return (
    <header className="bg-gradient-to-b from-yellow-700 to-yellow-500 px-4 py-8 lg:px-14 pb-36">
      <div className="w-full max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <HeaderNavigation />
          </div>
          <div className="flex items-center">
            <ClerkLoaded>
              <UserButton afterSignOutUrl="/sign-in" />
            </ClerkLoaded>
            <ClerkLoading>
              <div className="h-[28px] w-[28px] rounded-full bg-white/30 flex items-center justify-center">
                <Loader2 className="animate-spin size-3 text-white/60" />
              </div>
            </ClerkLoading>
          </div>
        </div>
        <WelcomeMsg />
      </div>
    </header>
  );
};
