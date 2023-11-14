<?php

namespace MageSuite\ContentConstructorAdmin\Test\Constraint;

interface AssertionRegexBuilder
{
    /**
     * Builds regex to verify specific component contents
     * @param $component
     * @return mixed
     */
    public function buildRegex($component);
}
