<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Model\ProductConditions;

class AttributeCatalog
{
    public const string LABEL = 'label';
    public const string INPUT_TYPE = 'input_type';
    public const string OPERATORS = 'operators';
    public const string OPTIONS = 'options';
    public const string FIXED_VALUE = 'fixed_value';

    protected const string PRODUCT_CONDITION = \Smile\ElasticsuiteVirtualCategory\Model\Rule\WidgetCondition\Product::class;
    protected const array EXCLUDED_OPERATORS = ['<=>'];
    protected const string HIDDEN_VALUE_ELEMENT_TYPE = 'hidden';
    protected const string FIXED_OPERATOR = '==';
    protected const string FIXED_VALUE_FLAG = '1';

    protected ?array $attributes = null;

    public function __construct(
        protected \Magento\CatalogWidget\Model\RuleFactory $ruleFactory,
        protected \Magento\Rule\Model\ConditionFactory $conditionFactory,
        protected \Smile\ElasticsuiteCatalogRule\Model\Rule\Condition\Product\SpecialAttributesProvider $specialAttributesProvider
    ) {
    }

    public function getAttributes(): array
    {
        if ($this->attributes === null) {
            $this->attributes = $this->loadAttributes();
        }

        return $this->attributes;
    }

    public function getAttribute(string $attributeCode): ?array
    {
        return $this->getAttributes()[$attributeCode] ?? null;
    }

    protected function loadAttributes(): array
    {
        $rule = $this->ruleFactory->create();
        $attributes = [];

        foreach ($this->createCondition($rule)->loadAttributeOptions()->getAttributeOption() as $attributeCode => $label) {
            $condition = $this->createCondition($rule);
            $condition->setAttribute($attributeCode);

            $attributes[$attributeCode] = $this->describeAttribute($condition, (string) $attributeCode, (string) $label);
        }

        return $attributes;
    }

    protected function describeAttribute(
        \Magento\Rule\Model\Condition\AbstractCondition $condition,
        string $attributeCode,
        string $label
    ): array {
        $isFixedValue = $this->isFixedValueAttribute($attributeCode);

        return [
            self::LABEL => $label,
            self::INPUT_TYPE => (string) $condition->getInputType(),
            self::OPERATORS => $isFixedValue ? $this->getFixedOperator($condition) : $this->getOperators($condition),
            self::OPTIONS => $isFixedValue ? [] : $this->getOptions($condition),
            self::FIXED_VALUE => $isFixedValue ? self::FIXED_VALUE_FLAG : null,
        ];
    }

    protected function isFixedValueAttribute(string $attributeCode): bool
    {
        $specialAttribute = $this->specialAttributesProvider->getList()[$attributeCode] ?? null;

        return $specialAttribute !== null && $specialAttribute->getValueElementType() === self::HIDDEN_VALUE_ELEMENT_TYPE;
    }

    protected function getFixedOperator(\Magento\Rule\Model\Condition\AbstractCondition $condition): array
    {
        $operators = $this->getOperators($condition);

        return [self::FIXED_OPERATOR => $operators[self::FIXED_OPERATOR] ?? self::FIXED_OPERATOR];
    }

    protected function createCondition(\Magento\CatalogWidget\Model\Rule $rule): \Magento\Rule\Model\Condition\AbstractCondition
    {
        $condition = $this->conditionFactory->create(self::PRODUCT_CONDITION);
        $condition->setRule($rule);

        return $condition;
    }

    protected function getOperators(\Magento\Rule\Model\Condition\AbstractCondition $condition): array
    {
        $operators = [];

        foreach ($condition->getOperatorSelectOptions() as $option) {
            $operator = (string) $option['value'];

            if (!in_array($operator, self::EXCLUDED_OPERATORS, true)) {
                $operators[$operator] = (string) $option['label'];
            }
        }

        return $operators;
    }

    protected function getOptions(\Magento\Rule\Model\Condition\AbstractCondition $condition): array
    {
        return $this->flattenOptions((array) $condition->getValueSelectOptions());
    }

    protected function flattenOptions(array $selectOptions): array
    {
        $options = [];

        foreach ($selectOptions as $option) {
            $value = $option['value'] ?? '';

            if (is_array($value)) {
                $options += $this->flattenOptions($value);
                continue;
            }

            $label = trim((string) ($option['label'] ?? ''));

            if ((string) $value !== '' && $label !== '') {
                $options[(string) $value] = $label;
            }
        }

        return $options;
    }
}
