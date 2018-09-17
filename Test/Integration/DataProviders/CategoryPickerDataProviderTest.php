<?php

namespace MageSuite\ContentConstructorAdmin\Test\Integration\DataProviders;

class CategoryPickerDataProviderTest extends \PHPUnit\Framework\TestCase
{
    const ROOT_CATEGORY_ID = 1;

    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    private $objectManager;

    /**
     * @var \MageSuite\ContentConstructorAdmin\DataProviders\CategoryPickerDataProvider
     */
    private $dataProvider;

    public function setUp() {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();

        $this->dataProvider = $this->objectManager
            ->get(\MageSuite\ContentConstructorAdmin\DataProviders\CategoryPickerDataProvider::class);
    }

    /**
     * @magentoDbIsolation enabled
     * @magentoDataFixture Magento/Catalog/_files/categories_no_products.php
     * @magentoDataFixture loadCategoriesNotIncludedInMenu
     */
    public function testItReturnsCorrectCategoryStructure() {
        $result = $this->dataProvider->getCategories(self::ROOT_CATEGORY_ID);

        $this->assertArrayHasKey('optgroup', $result);

        $this->assertCount(8, $result['optgroup'][0]['optgroup']);

        $this->assertCount(2, $result['optgroup'][0]['optgroup'][0]['optgroup']);

        $this->assertEquals('Category 1', $result['optgroup'][0]['optgroup'][0]['label']);
        $this->assertEquals('Not included in menu', $result['optgroup'][0]['optgroup'][1]['label']);
        $this->assertEquals('Category 2', $result['optgroup'][0]['optgroup'][2]['label']);
        $this->assertEquals('Category 1.1', $result['optgroup'][0]['optgroup'][0]['optgroup'][0]['label']);
        $this->assertEquals('Category 1.1.1', $result['optgroup'][0]['optgroup'][0]['optgroup'][0]['optgroup'][0]['label']);

        $this->assertEquals('http://localhost/index.php/category-1.html', $result['optgroup'][0]['optgroup'][0]['url']);

        $this->assertEquals(
            'http://localhost/index.php/category-1/category-1-1.html',
            $result['optgroup'][0]['optgroup'][0]['optgroup'][0]['url']
        );

        $this->assertEquals(
            'http://localhost/index.php/category-1/category-1-1/category-1-1-1.html',
            $result['optgroup'][0]['optgroup'][0]['optgroup'][0]['optgroup'][0]['url']
        );
    }

    public static function loadCategoriesNotIncludedInMenu() {
        include __DIR__.'/../../../../content-constructor-frontend-extension/Test/Integration/DataProviders/_files/categories_not_included_in_menu.php';
    }
}