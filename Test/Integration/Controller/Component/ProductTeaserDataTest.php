<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Controller\Component;

class ProductTeaserDataTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    protected ?\Magento\TestFramework\ObjectManager $objectManager;
    protected ?\Magento\Catalog\Api\ProductRepositoryInterface $productRepository;

    protected function setUp(): void
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
    public function testItReturnCorrectProductData(): void
    {
        $this->reindex();

        $product = $this->productRepository->get('simple');

        $this->dispatch('/content-constructor/component/productteaserdata?sku=' . $product->getSku());

        $content = $this->getResponse()->getBody();

        $productData = json_decode($content, true);

        $this->assertEquals('Simple Product', $productData['product']['name']);
        $this->assertEquals('simple', $productData['product']['sku']);

        $assertContains = method_exists($this, 'assertStringContainsString') ? 'assertStringContainsString' : 'assertContains';
        $this->$assertContains('frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/small_image.jpg', $productData['product']['image']);

        $this->assertEquals('Short description', $productData['product']['shortDescription']);
    }

    public function testItReturnEmptyArrayForNotExistingProduct(): void
    {
        $this->dispatch('/content-constructor/component/productteaserdata?sku=not-existing-product');

        $content = $this->getResponse()->getBody();

        $productData = json_decode($content, true);

        $this->assertEmpty($productData['product']);
    }

    protected function reindex(): void
    {
        $indexerRegistry = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()
            ->create(\Magento\Framework\Indexer\IndexerRegistry::class);
        $indexerRegistry->get(\Magento\CatalogSearch\Model\Indexer\Fulltext::INDEXER_ID)->reindexAll();
        $indexerRegistry->get(\Magento\Catalog\Model\Indexer\Product\Price\Processor::INDEXER_ID)->reindexRow(1);
    }
}
