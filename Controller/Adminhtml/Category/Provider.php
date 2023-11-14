<?php

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Category;

use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\ResponseInterface;

class Provider extends Action
{
    const ROOT_CATEGORY_ID = 1;

    /**
     * @var Context
     */
    private $context;

    /**
     * @var \MageSuite\ContentConstructorAdmin\DataProviders\CategoryPickerDataProvider
     */
    private $categoryPickerDataProvider;

    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    private $jsonResultFactory;

    public function __construct(
        Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $jsonResultFactory,
        \MageSuite\ContentConstructorAdmin\DataProviders\CategoryPickerDataProvider $categoryPickerDataProvider
    )
    {
        parent::__construct($context);

        $this->context = $context;
        $this->categoryPickerDataProvider = $categoryPickerDataProvider;
        $this->jsonResultFactory = $jsonResultFactory;
    }

    /**
     * Dispatch request
     *
     * @return \Magento\Framework\Controller\ResultInterface|ResponseInterface
     * @throws \Magento\Framework\Exception\NotFoundException
     */
    public function execute()
    {
        $jsonResult = $this->jsonResultFactory->create();

        $categories = $this->categoryPickerDataProvider->getCategories(self::ROOT_CATEGORY_ID);

        return $jsonResult->setData($categories);
    }
}
