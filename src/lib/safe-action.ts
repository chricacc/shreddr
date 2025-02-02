import { ActionError } from "@/actions/model/ActionError";
import { createSafeActionClient } from "next-safe-action";
export const actionClient = createSafeActionClient({
    handleServerError: (error) => {

        if (error instanceof ActionError) {
            return error.message;
        }

        return 'Oops, something went wrong, try again, or contact an admin!';
    },
    defaultValidationErrorsShape: "flattened",
});