<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // access is restricted by the auth:sanctum + admin middleware
    }

    public function rules(): array
    {
        // On update ("PUT") every field is optional, on create they are required.
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'name' => [$required, 'string', 'max:255'],
            'category' => [$required, 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'price' => [$required, 'numeric', 'min:0'],
            'stock' => [$required, 'integer', 'min:0'],
            'image' => ['nullable', 'string', 'max:2048'],
        ];
    }
}
