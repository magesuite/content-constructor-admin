<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Component;

class ProductTeaserData extends \Magento\Backend\App\Action implements \Magento\Framework\App\Action\HttpGetActionInterface
{
    public const string ADMIN_RESOURCE = 'Magento_Catalog::products';

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        protected \Magento\Framework\Controller\Result\JsonFactory $jsonFactory,
        protected \MageSuite\ContentConstructorAdmin\Model\Editor\ProductTeaserDataProvider $productTeaserDataProvider
    ) {
        parent::__construct($context);
    }

    public function execute(): \Magento\Framework\Controller\Result\Json
    {
        $productData = $this->productTeaserDataProvider->getProductData((string) $this->getRequest()->getParam('sku'));

        return $this->jsonFactory->create()->setData(['product' => $productData]);
    }
}
