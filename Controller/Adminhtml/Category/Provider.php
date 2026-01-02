<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Category;

class Provider extends \Magento\Backend\App\Action
{
    protected const ROOT_CATEGORY_ID = 1;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        protected \Magento\Framework\Controller\Result\JsonFactory $jsonResultFactory,
        protected \MageSuite\ContentConstructorAdmin\DataProviders\CategoryPickerDataProvider $categoryPickerDataProvider
    ) {
        parent::__construct($context);
    }

    public function execute() //phpcs:ignore
    {
        $jsonResult = $this->jsonResultFactory->create();
        $categories = $this->categoryPickerDataProvider->getCategories(self::ROOT_CATEGORY_ID);

        return $jsonResult->setData($categories);
    }
}
