<?php

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Upgrade;

class CategoriesMigrationTest extends \MageSuite\ContentConstructorAdmin\Test\Integration\Upgrade\AbstractMigrationTestCase
{
    /**
     * @var \Magento\Catalog\Model\CategoryRepository
     */
    protected $categoryRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->categoryRepository = $this->objectManager->get(\Magento\Catalog\Model\CategoryRepository::class);
    }

    /**
     * @magentoDbIsolation enabled
     * @magentoAppIsolation enabled
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
                self::ALL_STORE_VIEWS => [101, 102],
                $store1->getId() => [102],
                $store2->getId() => [101, 103]
            ];

        foreach ($categoriesAndStores as $storeId => $categories) {
            $layoutUpdate = $this->getXmlInputStringForStoreId($storeId);
            foreach ($categories as $id) {
                $category = $this->categoryRepository->get($id, $storeId);
                $category->setLayoutUpdateXmlBackup('');
                $category->setContentConstructorContent('');
                $category->setCustomLayoutUpdate($layoutUpdate);
                $category->save();
            }
        }

        $this->migration->transferOldXmlValuesToNewJsonFields();
        $this->runAssertions($categoriesAndStores, $this->categoryRepository, 100);
    }

    protected function getItemFromRepository($repository, $id, $storeId)
    {
        $item = \Magento\Framework\App\ObjectManager::getInstance()->get(\Magento\Catalog\Model\CategoryFactory::class);
        $item = $item->create()->setStoreId($storeId)->load($id);

        return $item;
    }

    public static function loadCategoriesFixture()
    {
        include __DIR__ . "/_files/categories.php";
    }

    public static function loadCategoriesFixtureRollback()
    {
        include __DIR__ . "/_files/categories_rollback.php";
    }
}
