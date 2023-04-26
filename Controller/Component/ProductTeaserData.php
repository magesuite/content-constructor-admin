<?php

namespace MageSuite\ContentConstructorAdmin\Controller\Component;

class ProductTeaserData extends \Magento\Framework\App\Action\Action implements \Magento\Framework\App\Action\HttpGetActionInterface
{
    protected \Magento\Framework\Controller\Result\JsonFactory $jsonFactory;
    protected \MageSuite\ContentConstructorFrontend\DataProviders\ProductCarouselDataProvider $productDataProvider;

    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $jsonFactory,
        \MageSuite\ContentConstructorFrontend\DataProviders\ProductCarouselDataProvider $productDataProvider
    ) {
        parent::__construct($context);
        $this->jsonFactory = $jsonFactory;
        $this->productDataProvider = $productDataProvider;
    }

    public function execute()
    {
        $sku = $this->getRequest()->getParam('sku');
        $this->productDataProvider->setSkipCollectionFilters(true);
        $products = $this->productDataProvider->getProducts(['skus' => $sku, 'collection_type' => 'db']);
        $product = !empty($products) ? array_shift($products) : [];
        $resultJson = $this->jsonFactory->create();

        return $resultJson->setData(['product' => $product]);
    }
}
