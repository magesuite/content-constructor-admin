<?php

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Upgrades;

class ProductsMigrationTest extends \MageSuite\ContentConstructorAdmin\Test\Integration\Upgrade\AbstractMigrationTestCase
{
    /**
     * @var \Magento\Catalog\Model\ProductRepository
     */
    protected $productRepository;

    public function setUp()
    {
        parent::setUp();
        $this->productRepository = $this->objectManager->get(\Magento\Catalog\Model\ProductRepository::class);
    }

    /**
     * @magentoDbIsolation disabled
     * @magentoAppIsolation enabled
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
            self::ALL_STORE_VIEWS => [1, 2],
            $store1->getId() => [2],
            $store2->getId() => [1, 3]
        ];

        foreach ($productsAndStores as $storeId => $products) {
            $layoutUpdate = $this->getXmlInputStringForStoreId($storeId);
            foreach ($products as $id) {
                $product = $this->productRepository->get("SKU-{$id}", false, $storeId);
                $product->setCustomLayoutUpdate($layoutUpdate);
                $product->save();
            }
        }

        $this->migration->transferOldXmlValuesToNewJsonFields();
        $this->runAssertions($productsAndStores, $this->productRepository);
    }

    protected function getItemFromRepository($repository, $id, $storeId)
    {
        return $repository->get("SKU-{$id}", false, $storeId, true);
    }

    public static function loadProductsFixture()
    {
        include __DIR__ . "/../../../../../magento/module-inventory-api/Test/_files/products.php";
    }

    public static function loadProductsFixtureRollback()
    {
        include __DIR__ . "/../../../../../magento/module-inventory-api/Test/_files/products_rollback.php";
    }
}
