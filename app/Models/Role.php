<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];


    /*
    |--------------------------------------------------------------------------
    | Users
    |--------------------------------------------------------------------------
    |
    | role_user is tenant-aware.
    |
    | The team_id pivot field tells us which team the role assignment belongs
    | to. Do not assume a role assignment is global.
    |
    */

    public function users(): BelongsToMany
    {
        return $this
            ->belongsToMany(
                User::class,
                'role_user',
                'role_id',
                'user_id'
            )
            ->withPivot(
                'team_id'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Permissions
    |--------------------------------------------------------------------------
    |
    | Permissions belong to the global role template.
    |
    */

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            Permission::class
        );
    }
}