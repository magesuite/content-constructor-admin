<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Model\Editor;

class ProductTeaserDataProvider
{
    public function __construct(
        protected \MageSuite\ContentConstructorFrontend\DataProviders\ProductCarouselDataProviderFactory $productDataProviderFactory,
        protected \Magento\Store\Model\App\Emulation $appEmulation,
        protected \Magento\Store\Model\StoreManagerInterface $storeManager
    ) {
    }

    public function getProductData(string $sku): array
    {
        $this->appEmulation->startEnvironmentEmulation(
            (int) $this->storeManager->getDefaultStoreView()->getId(),
            \Magento\Framework\App\Area::AREA_FRONTEND,
            true
        );

        try {
            $products = $this->getProducts($sku);
        } finally {
            $this->appEmulation->stopEnvironmentEmulation();
        }

        return $products === [] ? [] : array_shift($products);
    }

    protected function getProducts(string $sku): array
    {
        $productDataProvider = $this->productDataProviderFactory->create();
        $productDataProvider->setSkipCollectionFilters(true);

        return $productDataProvider->getProducts([
            'skus' => $sku,
            'collection_type' => \MageSuite\ContentConstructorFrontend\DataProviders\ProductCarouselDataProvider::COLLECTION_TYPE_DATABASE,
        ]);
    }
}
