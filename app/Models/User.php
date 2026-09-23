<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Concerns\HasTeams;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property int|null $current_team_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property-read Team|null $currentTeam
 * @property-read Collection<int, Team> $ownedTeams
 * @property-read Collection<int, Membership> $teamMemberships
 * @property-read Collection<int, Team> $teams
 */
#[Fillable([
    'name',
    'email',
    'password',
    'current_team_id',
])]
#[Hidden([
    'password',
    'two_factor_secret',
    'two_factor_recovery_codes',
    'remember_token',
])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;
    use HasTeams;
    use Notifiable;
    use PasskeyAuthenticatable;
    use TwoFactorAuthenticatable;


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' =>
                'datetime',

            'password' =>
                'hashed',

            'two_factor_confirmed_at' =>
                'datetime',
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Roles For Current Team
    |--------------------------------------------------------------------------
    |
    | A user's CMS role now belongs to a specific team.
    |
    | Example:
    |
    | Saravanan:
    |
    | Saravanan's Team -> Admin
    | Sudhakar's Team   -> Editor
    |
    | Calling:
    |
    | $user->roles()
    |
    | will only return roles belonging to the currently selected team.
    |
    */

    public function roles(): BelongsToMany
    {
        $relation = $this->belongsToMany(
            Role::class,
            'role_user',
            'user_id',
            'role_id'
        )
            ->withPivot('team_id');

        /*
        |--------------------------------------------------------------------------
        | No current team
        |--------------------------------------------------------------------------
        |
        | Normally every CMS user should have a current_team_id.
        |
        | If there is no current team, only legacy/unassigned role records
        | with team_id = NULL are considered.
        |
        */

        if ($this->current_team_id === null) {
            return $relation->wherePivotNull(
                'team_id'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Current Team Roles Only
        |--------------------------------------------------------------------------
        */

        return $relation->wherePivot(
            'team_id',
            $this->current_team_id
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Roles For A Specific Team
    |--------------------------------------------------------------------------
    |
    | Useful later when an administrator manages another team membership
    | without changing the user's current_team_id.
    |
    */

    public function rolesForTeam(
        int $teamId
    ): BelongsToMany {
        return $this->belongsToMany(
            Role::class,
            'role_user',
            'user_id',
            'role_id'
        )
            ->withPivot('team_id')
            ->wherePivot(
                'team_id',
                $teamId
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Check Role In Current Team
    |--------------------------------------------------------------------------
    */

    public function hasRole(
        string $roleName
    ): bool {
        return $this
            ->roles()
            ->where(
                'roles.name',
                $roleName
            )
            ->exists();
    }


    /*
    |--------------------------------------------------------------------------
    | Check Permission In Current Team
    |--------------------------------------------------------------------------
    |
    | Permissions are obtained from roles belonging only to the current team.
    |
    */

    public function hasPermission(
        string $permissionName
    ): bool {
        return $this
            ->roles()
            ->whereHas(
                'permissions',
                function ($query) use (
                    $permissionName
                ) {
                    $query->where(
                        'permissions.name',
                        $permissionName
                    );
                }
            )
            ->exists();
    }
}