<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Category;

class Provider extends \Magento\Framework\App\Action\Action
{
    protected const ROOT_CATEGORY_ID = 1;

    protected \MageSuite\ContentConstructorAdmin\DataProviders\CategoryPickerDataProvider $categoryPickerDataProvider;
    protected \Magento\Framework\Controller\Result\JsonFactory $jsonResultFactory;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $jsonResultFactory,
        \MageSuite\ContentConstructorAdmin\DataProviders\CategoryPickerDataProvider $categoryPickerDataProvider
    ) {
        parent::__construct($context);

        $this->categoryPickerDataProvider = $categoryPickerDataProvider;
        $this->jsonResultFactory = $jsonResultFactory;
    }

    public function execute() //phpcs:ignore
    {
        $jsonResult = $this->jsonResultFactory->create();
        $categories = $this->categoryPickerDataProvider->getCategories(self::ROOT_CATEGORY_ID);

        return $jsonResult->setData($categories);
    }
}
