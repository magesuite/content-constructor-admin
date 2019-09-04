<?php

namespace MageSuite\ContentConstructorAdmin\Service;

class TokenValidator
{
    const SECONDS_IN_HOUR = 3600;

    /**
     * @var \Magento\Integration\Helper\Oauth\Data
     */
    protected $oauthHelper;

    /**
     * @var \Magento\Framework\Stdlib\DateTime
     */
    protected $dateTime;

    /**
     * @var \Magento\Framework\Stdlib\DateTime\DateTime
     */
    protected $date;

    public function __construct(
        \Magento\Integration\Helper\Oauth\Data $oauthHelper,
        \Magento\Framework\Stdlib\DateTime $dateTime,
        \Magento\Framework\Stdlib\DateTime\DateTime $date
    ) {
        $this->oauthHelper = $oauthHelper;
        $this->dateTime = $dateTime;
        $this->date = $date;
    }

    public function isTokenExpired(\Magento\Integration\Model\Oauth\Token $token): bool
    {
        $tokenTtl = $this->oauthHelper->getAdminTokenLifetime();

        if (empty($tokenTtl)) {
            return false;
        }

        if ($this->dateTime->strToTime($token->getCreatedAt()) < ($this->date->gmtTimestamp() - $tokenTtl * self::SECONDS_IN_HOUR)) {
            return true;
        }

        return false;
    }
}
