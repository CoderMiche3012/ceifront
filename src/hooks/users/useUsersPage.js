import useUsersData from "./useUsersData";
import useUsersUI from "./useUsersUI";

export default function useUsersPage() {
  const usersData = useUsersData();
  const usersUI = useUsersUI(usersData.fetchUsers);

  return {
    ...usersData,
    ...usersUI,
  };
}