<?php

namespace Magesuite\ContentConstructorAdmin\Test\Integration\Upgrade;

class MigrationTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\Cms\Model\PageRepository
     */
    protected $pageRepository;

    /**
     * @var \Magento\Catalog\Model\CategoryRepository
     */
    protected $categoryRepository;

    /**
     * @var \Magento\Catalog\Model\ProductRepository
     */
    protected $productRepository;

    /**
     * @var \Magento\Store\Model\StoreRepository
     */
    protected $storeRepository;

    /**
     * @var \Magento\Store\Model\StoreManager
     */
    protected $storeManager;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Service\Upgrade\Migration
     */
    protected $migration;

    /**
     * @var \Magento\Framework\App\CacheInterface
     */
    protected $cache;

    public function setUp()
    {
        $objectManager = \Magento\TestFramework\ObjectManager::getInstance();
        $this->pageRepository = $objectManager->get(\Magento\Cms\Model\PageRepository::class);
        $this->productRepository = $objectManager->get(\Magento\Catalog\Model\ProductRepository::class);
        $this->categoryRepository = $objectManager->get(\Magento\Catalog\Model\CategoryRepository::class);

        $this->storeRepository = $objectManager->get(\Magento\Store\Model\StoreRepository::class);
        $this->storeManager = $objectManager->get(\Magento\Store\Model\StoreManager::class);
        $this->migration = $objectManager->get(\MageSuite\ContentConstructorAdmin\Service\Upgrade\Migration::class);
        $this->cache = $objectManager->get(\Magento\Framework\App\CacheInterface::class);
    }

    /**
     * @magentoDbIsolation enabled
     *
     * @magentoDataFixture loadPagesFixture
     * @magentoDataFixture loadWebsiteAndStoresFixture
     */
    public function testPagesMigrationOnUpgrade()
    {
        $store1 = $this->storeRepository->get("store_for_eu_website");
        $store2 = $this->storeRepository->get("store_for_us_website");
        $pagesAndStores =
        [
            0 => 1,
            $store1->getId() => 2,
            $store2->getId() => 3
        ];

        $button = "<referenceContainer name=\"cc-content\"><block class=\"MageSuite\ContentConstructorFrontend\Block\Component\" name=\"componentebe5\"><arguments><argument xsi:type=\"string\" name=\"type\">button</argument><argument xsi:type=\"string\" name=\"name\">__STOREID__</argument><argument xsi:type=\"string\" name=\"section\">cc-content</argument><argument xsi:type=\"array\" name=\"data\"><item name=\"label\" xsi:type=\"string\">Button</item><item name=\"target\" xsi:type=\"string\"></item><item name=\"componentVisibility\" xsi:type=\"array\"><item name=\"mobile\" xsi:type=\"string\">1</item><item name=\"desktop\" xsi:type=\"string\">1</item></item></argument></arguments></block></referenceContainer>";
        foreach ($pagesAndStores as $storeId => $pageId) {
            $layoutUpdate = str_replace("__STOREID__", "button_store_{$storeId}", $button);

            $page = $this->pageRepository->getById("page_test_tag{$pageId}");
            $page->setStoreId($storeId);
            $page->setLayoutUpdateXml($layoutUpdate);
            $page->save();
        }

        $this->migration->transferOldXmlValuesToNewJsonFields();
        foreach ($pagesAndStores as $storeId => $pageId) {
            $page = $this->pageRepository->getById($pageId);
            $content = $page->getContentConstructorContent();

            $this->assertJson($content);
            $this->assertEquals("button_store_{$storeId}", json_decode($content, 1)[0]["name"]);
        }
    }

    /**
     * @magentoDbIsolation disabled
     *
     * @magentoDataFixture loadWebsiteAndStoresFixture
     * @magentoDataFixture loadProductsFixture
     * @magentoDataFixture loadReindexInventoryFixture
     */
    public function testProductsMigrationOnUpgrade()
    {
        $store1 = $this->storeRepository->get("store_for_eu_website");
        $store2 = $this->storeRepository->get("store_for_us_website");
        $productsAndStores =
        [
            0 => [1, 2],
            $store1->getId() => [2],
            $store2->getId() => [1, 3]
        ];

        $button = "<referenceContainer name=\"cc-content\"><block class=\"MageSuite\ContentConstructorFrontend\Block\Component\" name=\"componentebe5\"><arguments><argument xsi:type=\"string\" name=\"type\">button</argument><argument xsi:type=\"string\" name=\"name\">__STOREID__</argument><argument xsi:type=\"string\" name=\"section\">cc-content</argument><argument xsi:type=\"array\" name=\"data\"><item name=\"label\" xsi:type=\"string\">Button</item><item name=\"target\" xsi:type=\"string\"></item><item name=\"componentVisibility\" xsi:type=\"array\"><item name=\"mobile\" xsi:type=\"string\">1</item><item name=\"desktop\" xsi:type=\"string\">1</item></item></argument></arguments></block></referenceContainer>";
        foreach ($productsAndStores as $storeId => $products) {
            foreach ($products as $id) {
                $layoutUpdate = str_replace("__STOREID__", "button_store_{$storeId}", $button);
                $product = $this->productRepository->get("SKU-{$id}", false, $storeId);
                $product->setCustomLayoutUpdate($layoutUpdate);
                $product->save();
            }
        }

        $this->migration->transferOldXmlValuesToNewJsonFields();
        $this->runAssertions($productsAndStores, $this->productRepository);
    }

    /**
     * @magentoDbIsolation enabled
     *
     * @magentoDataFixture loadCategoriesFixture
     * @magentoDataFixture loadWebsiteAndStoresFixture
     */
    public function testCategoriesMigrationOnUpgrade()
    {
        $store1 = $this->storeRepository->get("store_for_eu_website");
        $store2 = $this->storeRepository->get("store_for_us_website");
        $categoriesAndStores =
            [
                0 => [1, 2],
                $store1->getId() => [2],
                $store2->getId() => [1, 3]
            ];

        $button = "<referenceContainer name=\"cc-content\"><block class=\"MageSuite\ContentConstructorFrontend\Block\Component\" name=\"componentebe5\"><arguments><argument xsi:type=\"string\" name=\"type\">button</argument><argument xsi:type=\"string\" name=\"name\">__STOREID__</argument><argument xsi:type=\"string\" name=\"section\">cc-content</argument><argument xsi:type=\"array\" name=\"data\"><item name=\"label\" xsi:type=\"string\">Button</item><item name=\"target\" xsi:type=\"string\"></item><item name=\"componentVisibility\" xsi:type=\"array\"><item name=\"mobile\" xsi:type=\"string\">1</item><item name=\"desktop\" xsi:type=\"string\">1</item></item></argument></arguments></block></referenceContainer>";
        foreach ($categoriesAndStores as $storeId => $categories) {
            foreach ($categories as $id) {
                $layoutUpdate = str_replace("__STOREID__", "button_store_{$storeId}", $button);
                $category = $this->categoryRepository->get($id, $storeId);
                $category->setCustomLayoutUpdate($layoutUpdate);
                $category->save();
            }
        }

        $this->migration->transferOldXmlValuesToNewJsonFields();
        $this->runAssertions($categoriesAndStores, $this->categoryRepository);
    }

    protected function runAssertions(array $input, $repository)
    {
        foreach ($input as $storeId => $items) {
            for ($i = 1; $i <= 3; $i++) {
                $item = $this->getItemFromRepository($repository, $i, $storeId);
                $content = $item->getContentConstructorContent();

                if (in_array($i, $items)) {
                    $this->assertJson($content);
                    $this->assertEquals("button_store_{$storeId}", json_decode($content, 1)[0]["name"]);
                } elseif (in_array($i, $input[0])) {
                    $this->assertJson($content);
                    $this->assertContains("button_store_0", json_decode($content, 1)[0]["name"]);
                } else {
                    $this->assertNull($content);
                }
            }
        }
    }

    protected function getItemFromRepository($repository, $id, $storeId)
    {
        if ($repository instanceof \Magento\Catalog\Model\ProductRepository) {
            $item = $repository->get("SKU-{$id}", false, $storeId, true);
        } elseif ($repository instanceof \Magento\Cms\Model\PageRepository) {
            $item = $repository->getById($id);
        } elseif ($repository instanceof \Magento\Catalog\Model\CategoryRepository) {
            $item = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Catalog\Model\CategoryFactory::class);
            $item = $item->create()->setStoreId($storeId)->load($id);
        }

        return $item;
    }

    public static function loadPagesFixture()
    {
        include __DIR__ . "/../../../../magesuite-cms-tag-manager/Test/_files/pages.php";
    }

    public static function loadProductsFixture()
    {
        include __DIR__ . "/_files/products.php";
    }

    public static function loadCategoriesFixture()
    {
        include __DIR__ . "/_files/categories.php";
    }

    public static function loadWebsiteAndStoresFixture()
    {
        include __DIR__ . "/_files/websites_with_stores.php";
    }

    public static function loadReindexInventoryFixture()
    {
        include __DIR__ . "/../../../../../magento/module-inventory-indexer/Test/_files/reindex_inventory.php";
    }

    public static function loadProductsFixtureRollback()
    {
        include __DIR__ . "/_files/products_rollback.php";
    }

    public static function loadReindexInventoryFixtureRollback()
    {
        include __DIR__ . "/_files/websites_with_stores_rollback.php";
    }
}
