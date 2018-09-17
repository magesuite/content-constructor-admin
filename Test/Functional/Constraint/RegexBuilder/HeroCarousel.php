<?php
/**
 * Translation Center for Magento 2
 *
 * @author    Marek Zabrowarny <marek.zabrowarny@creativestyle.pl>
 * @copyright 2016 creativestyle
 */


namespace MageSuite\ContentConstructorAdmin\Test\Constraint\RegexBuilder;

use MageSuite\ContentConstructorAdmin\Test\Constraint\AssertionRegexBuilder;

class HeroCarousel implements AssertionRegexBuilder
{
    /**
     * {@inheritdoc}
     *
     * @todo Add appropriate regex for a hero carousel as soon as its view is implemented on the frontend
     */
    public function buildRegex($component)
    {
        return '';
    }
}
