<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Model\ProductConditions;

#[\Magento\TestFramework\Fixture\AppArea('adminhtml')]
class AttributeCatalogTest extends \PHPUnit\Framework\TestCase
{
    public function testAttributesMatchWhatTheElasticsuiteWidgetConditionEditorOffers(): void
    {
        $attributes = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()
            ->create(\MageSuite\ContentConstructorAdmin\Model\ProductConditions\AttributeCatalog::class)
            ->getAttributes();

        $this->assertSame('numeric', $attributes['price']['input_type']);
        $this->assertArrayHasKey('>=', $attributes['price']['operators']);
        $this->assertArrayHasKey('<=', $attributes['price']['operators']);
        $this->assertArrayNotHasKey('<=>', $attributes['price']['operators']);
        $this->assertSame('category', $attributes['category_ids']['input_type']);
        $this->assertArrayHasKey('()', $attributes['category_ids']['operators']);
    }

    public function testElasticsuiteFlagPredicatesAreExposedAsFixedValues(): void
    {
        $attributes = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()
            ->create(\MageSuite\ContentConstructorAdmin\Model\ProductConditions\AttributeCatalog::class)
            ->getAttributes();

        $this->assertSame('1', $attributes['stock.is_in_stock']['fixed_value']);
        $this->assertSame(['=='], array_keys($attributes['stock.is_in_stock']['operators']));
        $this->assertSame([], $attributes['stock.is_in_stock']['options']);
        $this->assertNull($attributes['price']['fixed_value']);
    }

    public function testGroupedOptionsAreFlattenedIntoTheirValues(): void
    {
        $condition = $this->getMockBuilder(\Smile\ElasticsuiteVirtualCategory\Model\Rule\WidgetCondition\Product::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['loadAttributeOptions', 'getInputType', 'getOperatorSelectOptions', 'getValueSelectOptions'])
            ->getMock();
        $condition->setData('attribute_option', ['size' => 'Size']);
        $condition->method('loadAttributeOptions')->willReturnSelf();
        $condition->method('getInputType')->willReturn('select');
        $condition->method('getOperatorSelectOptions')->willReturn([['value' => '==', 'label' => 'is']]);
        $condition->method('getValueSelectOptions')->willReturn([
            ['value' => '', 'label' => ' '],
            ['label' => 'Women', 'value' => [['value' => '41', 'label' => 'S'], ['value' => '42', 'label' => 'M']]],
            ['value' => '43', 'label' => 'One size'],
        ]);

        $conditionFactory = $this->createMock(\Magento\Rule\Model\ConditionFactory::class);
        $conditionFactory->method('create')->willReturn($condition);

        $attributes = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->create(
            \MageSuite\ContentConstructorAdmin\Model\ProductConditions\AttributeCatalog::class,
            ['conditionFactory' => $conditionFactory]
        )->getAttributes();

        $this->assertSame(['41' => 'S', '42' => 'M', '43' => 'One size'], $attributes['size']['options']);
    }
}
