<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\ViewModel;

#[\Magento\TestFramework\Fixture\AppArea('adminhtml')]
class ProductConditionsTest extends \PHPUnit\Framework\TestCase
{
    public function testAttributesAreListedInCatalogOrderWithOperatorsAndOptionsAsValueLabelLists(): void
    {
        $attributeCatalog = $this->createMock(\MageSuite\ContentConstructorAdmin\Model\ProductConditions\AttributeCatalog::class);
        $attributeCatalog->method('getAttributes')->willReturn([
            'color' => [
                'label' => 'Color',
                'input_type' => 'select',
                'operators' => ['==' => 'is', '()' => 'is one of'],
                'options' => ['52' => 'Red', '49' => 'Black'],
            ],
            'price' => ['label' => 'Price', 'input_type' => 'numeric', 'operators' => ['>=' => 'equals or greater than'], 'options' => []],
        ]);

        $viewModel = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->create(
            \MageSuite\ContentConstructorAdmin\ViewModel\ProductConditions::class,
            ['attributeCatalog' => $attributeCatalog]
        );

        $this->assertSame([
            [
                'code' => 'color',
                'label' => 'Color',
                'input_type' => 'select',
                'operators' => [['value' => '==', 'label' => 'is'], ['value' => '()', 'label' => 'is one of']],
                'options' => [['value' => '52', 'label' => 'Red'], ['value' => '49', 'label' => 'Black']],
                'fixed_value' => null,
            ],
            [
                'code' => 'price',
                'label' => 'Price',
                'input_type' => 'numeric',
                'operators' => [['value' => '>=', 'label' => 'equals or greater than']],
                'options' => [],
                'fixed_value' => null,
            ],
        ], json_decode($viewModel->getAttributesJson(), true));
    }
}
