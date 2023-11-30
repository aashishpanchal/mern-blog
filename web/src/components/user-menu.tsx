import { UserState } from "api-states";

type Props = {
  user?: UserState;
};

export default function UserMenu({ user }: Props) {
  return (
    <div className="relative">
      <img
        src={
          user?.avatar
            ? user.avatar
            : `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${user?.fullname}`
        }
        alt={user?.fullname}
        className="w-10 h-10 rounded-full cursor-pointer"
      />
    </div>
  );
}
