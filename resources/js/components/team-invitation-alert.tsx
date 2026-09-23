import { router } from '@inertiajs/react';
import { InfoIcon } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import type { TeamInvitationContext } from '@/types';

type Props = {
    invitation: TeamInvitationContext;
    action: 'Log in' | 'Register';
};

export default function TeamInvitationAlert({
    invitation,
    action,
}: Props) {
    const acceptInvitation = () => {
        router.post(
            `/invitations/${invitation.code}/accept`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const declineInvitation = () => {
        router.delete(
            `/invitations/${invitation.code}`,
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <Alert
            data-test="team-invitation-alert"
            className="
                border-blue-200
                bg-blue-50
                text-blue-900
                dark:border-blue-900/50
                dark:bg-blue-950/50
                dark:text-blue-100
                [&>svg]:text-blue-600
                dark:[&>svg]:text-blue-400
            "
        >
            <InfoIcon />

            <AlertDescription className="text-blue-900 dark:text-blue-100">

                <p>
                    {action} to join the "{invitation.teamName}" team.
                </p>


                {action === 'Log in' && (

                    <div className="mt-4 flex flex-wrap gap-3">

                        <button
                            type="button"
                            onClick={acceptInvitation}
                            className="
                                rounded-lg
                                bg-blue-600
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-blue-700
                            "
                        >
                            Accept Invitation
                        </button>


                        <button
                            type="button"
                            onClick={declineInvitation}
                            className="
                                rounded-lg
                                border
                                border-blue-300
                                bg-white
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-blue-700
                                hover:bg-blue-50
                            "
                        >
                            Decline
                        </button>

                    </div>

                )}

            </AlertDescription>
        </Alert>
    );
}