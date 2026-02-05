<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Upgrades;

class ProductsMigrationTest extends \MageSuite\ContentConstructorAdmin\Test\Integration\Upgrade\AbstractMigrationTestCase
{
    protected \Magento\Catalog\Api\ProductRepositoryInterface $productRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->productRepository = $this->objectManager->get(\Magento\Catalog\Api\ProductRepositoryInterface::class);
    }

    /**
     * @magentoDbIsolation disabled
     * @magentoAppIsolation enabled
     *
     * @magentoDataFixture Magento_InventorySalesApi::Test/_files/websites_with_stores.php
     * @magentoDataFixture Magento_InventoryApi::Test/_files/products.php
     * @magentoDataFixture Magento_InventoryIndexer::Test/_files/reindex_inventory.php
     */
    public function testProductsMigrationOnUpgrade(): void
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
                $product->setLayoutUpdateXmlBackup('');
                $product->setContentConstructorContent('');
                $product->setCustomLayoutUpdate($layoutUpdate);
                $product->save();
            }
        }

        $this->migration->transferOldXmlValuesToNewJsonFields();
        $this->runAssertions($productsAndStores, $this->productRepository);
    }

    protected function getItemFromRepository($repository, $id, $storeId): \Magento\Catalog\Api\Data\ProductInterface
    {
        return $repository->get("SKU-{$id}", false, $storeId, true);
    }
}
