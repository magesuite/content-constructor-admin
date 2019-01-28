<?php

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Component;

use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\ResponseInterface;

class Configurator extends Action
{
    /**
     * @var \Magento\Framework\View\Layout
     */
    protected $layout;
    
    /**
     * @var Context
     */
    protected $context;

    /**
     * @var \Magento\Framework\Controller\Result\RawFactory
     */
    protected $resultRawFactory;

    /**
     * @var \MageSuite\ContentConstructor\ComponentManager
     */
    protected $componentManager;

    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $pageFactory;

    public function __construct(
        Context $context,
        \Magento\Framework\Controller\Result\RawFactory $resultRawFactory,
        \Magento\Framework\View\Result\PageFactory $pageFactory,
        \MageSuite\ContentConstructor\ComponentManager $componentManager,
        \Magento\Framework\View\Layout $layout
    )
    {
        parent::__construct($context);

        $this->context = $context;
        $this->resultRawFactory = $resultRawFactory;
        $this->componentManager = $componentManager;
        $this->pageFactory = $pageFactory;
        $this->layout = $layout;
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

//        if($type == 'button') {
//            $contents = $this->layout
//                ->createBlock(\MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component\Button::class)
//                ->toHtml();
//        }
//        else if($type == 'headline') {
//            $contents = $this->layout
//                ->createBlock(\MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component\Headline::class)
//                ->toHtml();
//        }
//        else if($type == 'product-carousel') {
//            $contents = $this->layout
//                ->createBlock(\MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component\ProductCarousel::class)
//                ->toHtml();
//        }
//        else if($type == 'paragraph') {
//            $contents = $this->layout
//                ->createBlock(\MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component\Paragraph::class)
//                ->toHtml();
//        }
//        else {
            $contents = $this->componentManager
                ->initializeComponent($type)
                ->renderConfigurator();
//        }

        return $resultRaw->setContents($contents);
    }
}