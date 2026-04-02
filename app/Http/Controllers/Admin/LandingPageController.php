<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingPage;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
    public function index(Request $request): Response
    {
        $query = LandingPage::with('product:id,name');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $perPage = in_array((int) $request->input('perPage'), [10, 15, 25, 50, 100])
            ? (int) $request->input('perPage')
            : 10;

        $landingPages = $query->orderBy('created_at', 'desc')->paginate($perPage)->withQueryString();

        return Inertia::render('admin/landing-pages/index', [
            'landingPages' => $landingPages,
            'filters' => $request->only(['search', 'perPage']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/landing-pages/create', [
            'products' => Product::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:landing_pages', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'hero_text' => ['nullable', 'string', 'max:1000'],
            'badge_text' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'use_cases' => ['nullable', 'array'],
            'use_cases.*.label' => ['required_with:use_cases', 'string', 'max:255'],
            'use_cases_title' => ['nullable', 'string', 'max:255'],
            'features' => ['nullable', 'array'],
            'features.*.title' => ['required_with:features', 'string', 'max:255'],
            'features.*.desc' => ['required_with:features', 'string', 'max:500'],
            'features_title' => ['nullable', 'string', 'max:255'],
            'specifications' => ['nullable', 'array'],
            'specifications.*.title' => ['required_with:specifications', 'string', 'max:255'],
            'specifications.*.specs' => ['required_with:specifications', 'array'],
            'specifications_title' => ['nullable', 'string', 'max:255'],
            'why_buy' => ['nullable', 'array'],
            'why_buy.*.title' => ['required_with:why_buy', 'string', 'max:255'],
            'why_buy.*.desc' => ['required_with:why_buy', 'string', 'max:255'],
            'why_buy_title' => ['nullable', 'string', 'max:255'],
            'checkout_banner_text' => ['nullable', 'string', 'max:500'],
            'footer_text' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ]);

        LandingPage::create($validated);

        return redirect()->route('admin.landing-pages.index')->with('success', 'Landing page created successfully.');
    }

    public function edit(LandingPage $landingPage): Response
    {
        return Inertia::render('admin/landing-pages/edit', [
            'landingPage' => $landingPage->load('product:id,name'),
            'products' => Product::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, LandingPage $landingPage): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('landing_pages')->ignore($landingPage->id), 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'hero_text' => ['nullable', 'string', 'max:1000'],
            'badge_text' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'use_cases' => ['nullable', 'array'],
            'use_cases.*.label' => ['required_with:use_cases', 'string', 'max:255'],
            'use_cases_title' => ['nullable', 'string', 'max:255'],
            'features' => ['nullable', 'array'],
            'features.*.title' => ['required_with:features', 'string', 'max:255'],
            'features.*.desc' => ['required_with:features', 'string', 'max:500'],
            'features_title' => ['nullable', 'string', 'max:255'],
            'specifications' => ['nullable', 'array'],
            'specifications.*.title' => ['required_with:specifications', 'string', 'max:255'],
            'specifications.*.specs' => ['required_with:specifications', 'array'],
            'specifications_title' => ['nullable', 'string', 'max:255'],
            'why_buy' => ['nullable', 'array'],
            'why_buy.*.title' => ['required_with:why_buy', 'string', 'max:255'],
            'why_buy.*.desc' => ['required_with:why_buy', 'string', 'max:255'],
            'why_buy_title' => ['nullable', 'string', 'max:255'],
            'checkout_banner_text' => ['nullable', 'string', 'max:500'],
            'footer_text' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ]);

        $landingPage->update($validated);

        return redirect()->route('admin.landing-pages.index')->with('success', 'Landing page updated successfully.');
    }

    public function destroy(LandingPage $landingPage): RedirectResponse
    {
        $landingPage->delete();

        return redirect()->route('admin.landing-pages.index')->with('success', 'Landing page deleted successfully.');
    }
}
