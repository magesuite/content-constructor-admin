<?php

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Image;

use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\ResponseInterface;

class Show extends Action
{
    /**
     * @var Context
     */
    private $context;

    /**
     * @var \Magento\Framework\Controller\Result\RedirectFactory
     */
    private $redirectFactory;

    /**
     * @var \MageSuite\ContentConstructorFrontend\Service\MediaResolver
     */
    private $mediaResolver;

    public function __construct(
        Context $context,
        \Magento\Framework\Controller\Result\RedirectFactory $redirectFactory,
        \MageSuite\ContentConstructorFrontend\Service\MediaResolver $mediaResolver
    )
    {
        parent::__construct($context);

        $this->context = $context;
        $this->redirectFactory = $redirectFactory;
        $this->mediaResolver = $mediaResolver;
    }

    /**
     * Dispatch request
     *
     * @return \Magento\Framework\Controller\ResultInterface|ResponseInterface
     * @throws \Magento\Framework\Exception\NotFoundException
     */
    public function execute()
    {
        $image = base64_decode($this->getRequest()->getParam('image'));

        $url = $this->mediaResolver->resolve($image);

        $redirect = $this->redirectFactory->create();
        $redirect->setPath($url);

        return $redirect;
    }
}
