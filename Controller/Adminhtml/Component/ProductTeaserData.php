<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Component;

class ProductTeaserData extends \Magento\Backend\App\Action implements \Magento\Framework\App\Action\HttpGetActionInterface
{
    public const string ADMIN_RESOURCE = 'Magento_Catalog::products';

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        protected \Magento\Framework\Controller\Result\JsonFactory $jsonFactory,
        protected \MageSuite\ContentConstructorFrontend\DataProviders\ProductCarouselDataProviderFactory $productDataProviderFactory
    ) {
        parent::__construct($context);
    }

    public function execute(): \Magento\Framework\Controller\Result\Json
    {
        $productDataProvider = $this->productDataProviderFactory->create();
        $productDataProvider->setSkipCollectionFilters(true);
        $products = $productDataProvider->getProducts([
            'skus' => (string) $this->getRequest()->getParam('sku'),
            'collection_type' => \MageSuite\ContentConstructorFrontend\DataProviders\ProductCarouselDataProvider::COLLECTION_TYPE_DATABASE,
        ]);

        return $this->jsonFactory->create()->setData(['product' => $products === [] ? [] : array_shift($products)]);
    }
}
