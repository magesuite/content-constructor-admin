<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\ViewModel;

class ProductConditions implements \Magento\Framework\View\Element\Block\ArgumentInterface
{
    public function __construct(
        protected \MageSuite\ContentConstructorAdmin\Model\ProductConditions\AttributeCatalog $attributeCatalog,
        protected \Magento\Framework\Serialize\Serializer\Json $jsonSerializer
    ) {
    }

    public function getAttributesJson(): string
    {
        $attributes = [];

        foreach ($this->attributeCatalog->getAttributes() as $attributeCode => $attribute) {
            $attributes[] = [
                'code' => (string) $attributeCode,
                'label' => $attribute[\MageSuite\ContentConstructorAdmin\Model\ProductConditions\AttributeCatalog::LABEL],
                'input_type' => $attribute[\MageSuite\ContentConstructorAdmin\Model\ProductConditions\AttributeCatalog::INPUT_TYPE],
                'operators' => $this->convertToOptionList($attribute[\MageSuite\ContentConstructorAdmin\Model\ProductConditions\AttributeCatalog::OPERATORS]),
                'options' => $this->convertToOptionList($attribute[\MageSuite\ContentConstructorAdmin\Model\ProductConditions\AttributeCatalog::OPTIONS]),
                'fixed_value' => $attribute[\MageSuite\ContentConstructorAdmin\Model\ProductConditions\AttributeCatalog::FIXED_VALUE] ?? null,
            ];
        }

        return (string) $this->jsonSerializer->serialize($attributes);
    }

    protected function convertToOptionList(array $labelsByValue): array
    {
        $optionList = [];

        foreach ($labelsByValue as $value => $label) {
            $optionList[] = ['value' => (string) $value, 'label' => $label];
        }

        return $optionList;
    }
}
