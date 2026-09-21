<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LanguageController extends Controller
{
    /**
     * Display all languages.
     */
    public function index()
    {
        $languages = Language::query()
            ->ordered()
            ->get();

        return Inertia::render('Languages/Index', [
            'languages' => $languages,
        ]);
    }

    /**
     * Show create language form.
     */
    public function create()
    {
        return Inertia::render('Languages/Create');
    }

    /**
     * Store a new language.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'native_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'code' => [
                'required',
                'string',
                'max:10',
                'alpha_dash',
                'unique:languages,code',
            ],

            'is_default' => [
                'required',
                'boolean',
            ],

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],

            'sort_order' => [
                'required',
                'integer',
                'min:0',
            ],
        ]);

        $validated['code'] =
            strtolower($validated['code']);

        DB::transaction(function () use ($validated) {

            /*
            |--------------------------------------------------------------------------
            | If this language is default,
            | remove default from all other languages.
            |--------------------------------------------------------------------------
            */

            if ($validated['is_default']) {

                Language::query()
                    ->where('is_default', true)
                    ->update([
                        'is_default' => false,
                    ]);
            }

            Language::create($validated);
        });

        return redirect()
            ->route('admin.languages.index')
            ->with(
                'success',
                'Language created successfully.'
            );
    }

    /**
     * Show edit language form.
     */
    public function edit(Language $language)
    {
        return Inertia::render('Languages/Edit', [
            'language' => $language,
        ]);
    }

    /**
     * Update language.
     */
    public function update(
        Request $request,
        Language $language
    ) {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'native_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'code' => [
                'required',
                'string',
                'max:10',
                'alpha_dash',

                Rule::unique(
                    'languages',
                    'code'
                )->ignore($language->id),
            ],

            'is_default' => [
                'required',
                'boolean',
            ],

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],

            'sort_order' => [
                'required',
                'integer',
                'min:0',
            ],
        ]);

        $validated['code'] =
            strtolower($validated['code']);

        DB::transaction(function () use (
            $validated,
            $language
        ) {

            /*
            |--------------------------------------------------------------------------
            | If this language is being set as default,
            | clear default from all other languages.
            |--------------------------------------------------------------------------
            */

            if ($validated['is_default']) {

                Language::query()
                    ->where(
                        'id',
                        '!=',
                        $language->id
                    )
                    ->where(
                        'is_default',
                        true
                    )
                    ->update([
                        'is_default' => false,
                    ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Prevent default language from being inactive.
            |--------------------------------------------------------------------------
            */

            if ($validated['is_default']) {

                $validated['status'] =
                    'active';
            }

            $language->update(
                $validated
            );
        });

        return redirect()
            ->route('admin.languages.index')
            ->with(
                'success',
                'Language updated successfully.'
            );
    }

    /**
     * Toggle active / inactive status.
     */
    public function toggleStatus(
        Language $language
    ) {
        /*
        |--------------------------------------------------------------------------
        | Default language must always remain active.
        |--------------------------------------------------------------------------
        */

        if (
            $language->is_default &&
            $language->status === 'active'
        ) {
            return back()->with(
                'error',
                'The default language cannot be disabled.'
            );
        }

        $language->update([
            'status' => $language->status === 'active'
                    ? 'inactive'
                    : 'active',
        ]);

        return back()->with(
            'success',
            'Language status updated successfully.'
        );
    }

    /**
     * Delete a language.
     */
    public function destroy(
        Language $language
    ) {
        /*
        |--------------------------------------------------------------------------
        | Default language cannot be deleted.
        |--------------------------------------------------------------------------
        */

        if ($language->is_default) {

            return back()->with(
                'error',
                'The default language cannot be deleted.'
            );
        }

        $language->delete();

        return redirect()
            ->route('admin.languages.index')
            ->with(
                'success',
                'Language deleted successfully.'
            );
    }
}
