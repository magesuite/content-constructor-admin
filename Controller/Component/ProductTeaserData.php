<?php

namespace MageSuite\ContentConstructorAdmin\Controller\Component;

class ProductTeaserData extends \Magento\Framework\App\Action\Action implements \Magento\Framework\App\Action\HttpGetActionInterface
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $jsonFactory;
    /**
     * @var \MageSuite\ContentConstructorFrontend\DataProviders\ProductCarouselDataProvider
     */
    protected $productDataProvider;

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

        $products = $this->productDataProvider->getProducts(['skus' => $sku]);

        $product = !empty($products) ? array_shift($products) : [];

        $resultJson = $this->jsonFactory->create();

        return $resultJson->setData(['product' => $product]);
    }
}
