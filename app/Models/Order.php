<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    public const PENDING = 'pending';
    public const APPROVED = 'approved';

    public const CASH_ON_DELIVERY = 'cash_on_delivery';
    public const BANK_TRANSFER = 'bank_transfer';

    /** Payment methods a customer can choose at checkout. */
    public const PAYMENT_METHODS = [self::CASH_ON_DELIVERY, self::BANK_TRANSFER];

    protected $fillable = [
        'customer_name',
        'customer_email',
        'address',
        'payment_method',
        'total_price',
        'status',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
