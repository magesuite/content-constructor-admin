<?php

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Component;

use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\ResponseInterface;

class Configurator extends Action
{
    /**
     * @var Context
     */
    private $context;
    /**
     * @var \Magento\Framework\Controller\Result\RawFactory
     */
    private $resultRawFactory;

    /**
     * @var \MageSuite\ContentConstructor\ComponentManager
     */
    private $componentManager;
    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    private $pageFactory;

    public function __construct(
        Context $context,
        \Magento\Framework\Controller\Result\RawFactory $resultRawFactory,
        \Magento\Framework\View\Result\PageFactory $pageFactory,
        \MageSuite\ContentConstructor\ComponentManager $componentManager
    )
    {
        parent::__construct($context);

        $this->context = $context;
        $this->resultRawFactory = $resultRawFactory;
        $this->componentManager = $componentManager;
        $this->pageFactory = $pageFactory;
    }

    /**
     * Dispatch request
     *
     * @return \Magento\Framework\Controller\ResultInterface|ResponseInterface
     * @throws \Magento\Framework\Exception\NotFoundException
     */
    public function execute()
    {
        $resultRaw = $this->resultRawFactory->create();

        $type = $this->getRequest()->getParam('type');

        $contents = $this->componentManager
            ->initializeComponent($type)
            ->renderConfigurator();

        return $resultRaw->setContents($contents);
    }
}