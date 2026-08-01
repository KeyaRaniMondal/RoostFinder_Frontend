
import { getSessionUser } from "@/lib/session";
import { logoutUser } from "@/app/(auth)/_actions/authActionLogin";
import { Navbar } from "./navbar";
import type { Role } from "@/lib/validations/loginAuth";
import { logoutAction } from "@/app/(auth)/_actions/logoutAction";

export async function NavbarServer() {
    const user = await getSessionUser();

    return (
        <Navbar
            isAuthenticated={!!user}
            role={(user?.role as Role) ?? null}
            name={typeof user?.name === "string" ? user.name : null}
            logoutAction={logoutUser}
        />
    );
}