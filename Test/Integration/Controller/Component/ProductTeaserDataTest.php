<?php

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Controller\Component;

class ProductTeaserDataTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    protected $objectManager;

    /**
     * @var \Magento\Catalog\Api\ProductRepositoryInterface
     */
    protected $productRepository;

    protected function setUp()
    {
        parent::setUp();
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();
        $this->productRepository = $this->objectManager->get(\Magento\Catalog\Api\ProductRepositoryInterface::class);
    }

    /**
     * @magentoDataFixture Magento/Catalog/_files/product_simple.php
     * @magentoAppArea adminhtml
     * @magentoAppIsolation enabled
     * @magentoDbIsolation enabled
     */
    public function testItReturnCorrectProductData()
    {
        $this->reindex();

        $product = $this->productRepository->get('simple');

        $this->dispatch('/content-constructor/component/productteaserdata?sku=' . $product->getSku());

        $content = $this->getResponse()->getBody();

        $productData = json_decode($content, true);

        $this->assertEquals('Simple Product', $productData['product']['name']);
        $this->assertEquals('simple', $productData['product']['sku']);
        $this->assertContains('frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/small_image.jpg', $productData['product']['image']);
        $this->assertEquals('Short description', $productData['product']['shortDescription']);
    }

    public function testItReturnEmptyArrayForNotExistingProduct()
    {
        $this->dispatch('/backend/content-constructor/component/productteaserdata?sku=not-existing-product');

        $content = $this->getResponse()->getBody();

        $productData = json_decode($content, true);

        $this->assertEmpty($productData['product']);
    }

    protected function reindex()
    {
        $indexerRegistry = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()
            ->create(\Magento\Framework\Indexer\IndexerRegistry::class);
        $indexerRegistry->get(\Magento\CatalogSearch\Model\Indexer\Fulltext::INDEXER_ID)->reindexAll();
    }
}
