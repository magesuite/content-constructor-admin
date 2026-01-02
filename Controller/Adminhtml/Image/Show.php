<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Image;

class Show extends \Magento\Backend\App\Action
{
    public function __construct(
        protected \Magento\Backend\App\Action\Context $context,
        protected \Magento\Framework\Controller\Result\RedirectFactory $redirectFactory,
        protected \MageSuite\ContentConstructorFrontend\Service\MediaResolver $mediaResolver
    ) {
        parent::__construct($context);
    }

    /**
     * Dispatch request
     *
     * @return \Magento\Framework\Controller\ResultInterface|ResponseInterface
     * @throws \Magento\Framework\Exception\NotFoundException
     */
    public function execute() // phpcs:ignore
    {
        $image = base64_decode($this->getRequest()->getParam('image'));

        $url = $this->mediaResolver->resolve($image);

        $redirect = $this->redirectFactory->create();
        $redirect->setPath($url);

        return $redirect;
    }
}
