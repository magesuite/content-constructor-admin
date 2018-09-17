<?php

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Token;

use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\ResponseInterface;

class Generator extends Action
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
     * @var \Magento\Framework\View\Result\PageFactory
     */
    private $pageFactory;
    /**
     * @var Magento\Integration\Model\Oauth\TokenFactory
     */
    private $tokenFactory;
    /**
     * @var \Magento\Backend\Model\Auth\Session
     */
    private $authSession;

    public function __construct(
        Context $context,
        \Magento\Framework\Controller\Result\RawFactory $resultRawFactory,
        \Magento\Framework\View\Result\PageFactory $pageFactory,
        \Magento\Integration\Model\Oauth\TokenFactory $tokenFactory,
        \Magento\Backend\Model\Auth\Session $authSession
    )
    {
        parent::__construct($context);

        $this->context = $context;
        $this->resultRawFactory = $resultRawFactory;
        $this->pageFactory = $pageFactory;
        $this->tokenFactory = $tokenFactory;
        $this->authSession = $authSession;
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

        $currentUserId = $this->authSession->getUser()->getId();

        $token = $this->tokenFactory
            ->create()
            ->loadByAdminId($currentUserId)
            ->getToken();

        if($token === null) {
            $token = $this->tokenFactory
                ->create()
                ->createAdminToken($currentUserId)
                ->getToken();
        }

        return $resultRaw->setContents($token);
    }
}