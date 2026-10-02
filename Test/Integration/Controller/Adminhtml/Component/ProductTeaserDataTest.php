<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Controller\Adminhtml\Component;

#[\Magento\TestFramework\Fixture\AppArea('adminhtml')]
class ProductTeaserDataTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    protected $resource = 'Magento_Catalog::products';
    protected $uri = 'backend/content-constructor/component/productTeaserData';
    protected $httpMethod = \Magento\Framework\App\Request\Http::METHOD_GET;

    #[\Magento\TestFramework\Fixture\DataFixture('Magento/Catalog/_files/product_simple.php')]
    #[\Magento\TestFramework\Fixture\AppIsolation(true)]
    #[\Magento\TestFramework\Fixture\DbIsolation(true)]
    public function testItReturnsProductDataForAuthorizedAdmin(): void
    {
        $this->reindex();

        $productData = $this->dispatchForSku('simple');

        $this->assertSame('Simple Product', $productData['product']['name']);
        $this->assertSame('simple', $productData['product']['sku']);
        $this->assertStringContainsString('/frontend/', $productData['product']['image']);
        $this->assertStringContainsString('Magento_Catalog/images/product/placeholder/small_image.jpg', $productData['product']['image']);
        $this->assertSame('Short description', $productData['product']['shortDescription']);
    }

    public function testItReturnsEmptyProductForNotExistingSku(): void
    {
        $this->assertEmpty($this->dispatchForSku('not-existing-product')['product']);
    }

    protected function dispatchForSku(string $sku): array
    {
        $this->getRequest()->setMethod(\Magento\Framework\App\Request\Http::METHOD_GET);
        $this->getRequest()->setParam('sku', $sku);
        $this->dispatch($this->uri);

        return (array) json_decode($this->getResponse()->getBody(), true);
    }

    protected function reindex(): void
    {
        $indexerRegistry = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()
            ->create(\Magento\Framework\Indexer\IndexerRegistry::class);
        $indexerRegistry->get(\Magento\CatalogSearch\Model\Indexer\Fulltext::INDEXER_ID)->reindexAll();
        $indexerRegistry->get(\Magento\Catalog\Model\Indexer\Product\Price\Processor::INDEXER_ID)->reindexRow(1);
    }
}
