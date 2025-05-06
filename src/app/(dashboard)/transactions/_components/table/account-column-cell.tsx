import { useEditAccountState } from '@/features/accounts/hooks/use-edit-account';

type Props = {
  account: string;
  accountId: string;
};

export const AccountColumnCell = ({ account, accountId }: Props) => {
  const { onOpen } = useEditAccountState();

  const onClick = () => {
    onOpen(accountId);
  };

  return (
    <div onClick={onClick} className="pl-3 flex items-center cursor-pointer hover:underline">
      {account}
    </div>
  );
};
