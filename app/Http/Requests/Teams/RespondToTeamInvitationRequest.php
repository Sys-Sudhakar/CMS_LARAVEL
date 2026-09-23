<?php

namespace App\Http\Requests\Teams;

use App\Models\TeamInvitation;
use App\Rules\ValidTeamInvitation;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RespondToTeamInvitationRequest extends FormRequest
{
    /**
     * Determine whether the authenticated user may respond
     * to this invitation.
     */
    public function authorize(): bool
    {
        $user =
            $this->user();

        $invitation =
            $this->route(
                'invitation'
            );


        /*
        |--------------------------------------------------------------------------
        | Authentication Required
        |--------------------------------------------------------------------------
        */

        if (! $user) {
            return false;
        }


        /*
        |--------------------------------------------------------------------------
        | Valid Invitation Route Model
        |--------------------------------------------------------------------------
        */

        if (! $invitation instanceof TeamInvitation) {
            return false;
        }


        /*
        |--------------------------------------------------------------------------
        | Invitation Email Must Match Logged-In User
        |--------------------------------------------------------------------------
        |
        | Example:
        |
        | Invitation:
        | aniruth@company.com
        |
        | Logged in:
        | aniruth@company.com   -> allowed
        |
        | Logged in:
        | another@company.com   -> denied
        |
        */

        return strtolower(
            trim(
                (string) $invitation->email
            )
        ) === strtolower(
            trim(
                (string) $user->email
            )
        );
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'invitation' => [
                'required',

                new ValidTeamInvitation(
                    $this->user()
                ),
            ],
        ];
    }


    /**
     * Get the validation data from the request.
     *
     * @return array<string, mixed>
     */
    public function validationData(): array
    {
        return array_merge(
            parent::validationData(),
            [
                'invitation' =>
                    $this->route(
                        'invitation'
                    ),
            ]
        );
    }


    /**
     * Authorization failure message.
     */
    protected function failedAuthorization(): void
    {
        abort(
            403,
            'This invitation was not sent to your account.'
        );
    }
}